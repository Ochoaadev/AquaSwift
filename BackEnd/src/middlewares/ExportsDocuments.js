const Resultado = require('../models/ResultadoModel');
const Competencia = require('../models/CompetModel');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const Atleta = require('../models/AtletaModels'); // Asegúrate de importar el modelo Atleta

// Función común para obtener datos
const getExportData = async (competenciaId) => {
  try {
    const competencia = await Competencia.findById(competenciaId).lean();
    if (!competencia) throw new Error('Competencia no encontrada');

    // Primero obtenemos los resultados básicos
    const resultados = await Resultado.find({ Competencia: competenciaId })
      .populate({
        path: 'Atleta',
        select: 'Nombre_Apellido Nombre Apellido', // Seleccionamos todos los campos posibles
        options: { lean: true }
      })
      .populate({
        path: 'Prueba',
        select: 'Nombre',
        options: { lean: true }
      })
      .sort({ Prueba: 1, Posicion: 1 })
      .lean();

    // Verificamos los datos obtenidos
    console.log('Datos obtenidos para exportación:', JSON.stringify(resultados, null, 2));

    return { competencia, resultados };
  } catch (error) {
    console.error('Error en getExportData:', error);
    throw error;
  }
};

// Función para obtener el nombre del atleta de manera segura
const getNombreAtleta = (atleta) => {
  if (!atleta) return 'Atleta no disponible';
  
  // Primero intentamos con Nombre_Apellido
  if (atleta.Nombre_Apellido) return atleta.Nombre_Apellido;
  
  // Si no existe, usamos Nombre y Apellido por separado
  if (atleta.Nombre && atleta.Apellido) return `${atleta.Nombre} ${atleta.Apellido}`;
  
  // Si no hay ningún nombre válido
  return 'Nombre no disponible';
};

// Exportar a Excel
exports.exportToExcel = async (req, res) => {
  try {
    const { competenciaId } = req.params;
    const { competencia, resultados } = await getExportData(competenciaId);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Resultados');
    
    worksheet.columns = [
      { header: 'Prueba', key: 'prueba', width: 30 },
      { header: 'Posición', key: 'posicion', width: 10 },
      { header: 'Atleta', key: 'atleta', width: 30 },
      { header: 'Marca', key: 'marca', width: 15 },
      { header: 'Puntos', key: 'puntos', width: 10 }
    ];

    resultados.forEach(resultado => {
      worksheet.addRow({
        prueba: resultado.Prueba?.Nombre || 'Prueba no disponible',
        posicion: resultado.Posicion,
        atleta: getNombreAtleta(resultado.Atleta),
        marca: resultado.Marca,
        puntos: resultado.Puntos
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=resultados_${competencia.Nombre.replace(/\s+/g, '_')}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error en exportToExcel:', error);
    res.status(500).json({ 
      message: 'Error al exportar a Excel',
      error: error.message 
    });
  }
};

// Exportar a PDF
exports.exportToPDF = async (req, res) => {
  try {
    const { competenciaId } = req.params;
    const { competencia, resultados } = await getExportData(competenciaId);

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=resultados_${competencia.Nombre.replace(/\s+/g, '_')}.pdf`
    );

    doc.pipe(res);

    // Encabezado
    doc.fontSize(20).text(`Resultados: ${competencia.Nombre}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha: ${competencia.Fecha.toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Agrupar por prueba
    const porPrueba = resultados.reduce((acc, resultado) => {
      const clave = resultado.Prueba?._id?.toString() || 'sin-prueba';
      if (!acc[clave]) {
        acc[clave] = {
          nombre: resultado.Prueba?.Nombre || 'Prueba no disponible',
          resultados: []
        };
      }
      acc[clave].resultados.push(resultado);
      return acc;
    }, {});

    // Contenido
    Object.values(porPrueba).forEach(prueba => {
      doc.fontSize(16).text(prueba.nombre, { underline: true });
      doc.moveDown();

      const startX = 50;
      const columnWidth = 120;
      let yPosition = doc.y;

      // Encabezados tabla
      doc.font('Helvetica-Bold')
        .fontSize(12)
        .text('Posición', startX, yPosition)
        .text('Atleta', startX + columnWidth, yPosition)
        .text('Marca', startX + columnWidth * 2, yPosition)
        .text('Puntos', startX + columnWidth * 3, yPosition);

      yPosition += 25;

      // Filas
      doc.font('Helvetica').fontSize(10);
      prueba.resultados.forEach(resultado => {
        doc.text(resultado.Posicion.toString(), startX, yPosition)
          .text(getNombreAtleta(resultado.Atleta), startX + columnWidth, yPosition)
          .text(resultado.Marca, startX + columnWidth * 2, yPosition)
          .text(resultado.Puntos.toString(), startX + columnWidth * 3, yPosition);
        
        yPosition += 20;
      });

      doc.moveDown(2);
    });

    doc.end();
  } catch (error) {
    console.error('Error en exportToPDF:', error);
    res.status(500).json({ 
      message: 'Error al exportar a PDF',
      error: error.message 
    });
  }
};