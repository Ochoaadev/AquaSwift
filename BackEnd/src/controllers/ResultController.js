const Resultado = require('../models/ResultadoModel');
const Competencia = require('../models/CompetModel');
const Prueba = require('../models/PruebaModel');
const Atleta = require('../models/AtletaModels');
const Inscripcion = require('../models/InscripModel'); // Nota el nombre del modelo

const handleError = (res, error) => {
  console.error('Error en resultadoController:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({ 
      success: false,
      message: Object.values(error.errors).map(e => e.message).join(', ')
    });
  }
  
  if (error.code === 11000) {
    const errorType = error.message.includes('resultado_unico') 
      ? 'El atleta ya tiene un resultado registrado para esta prueba'
      : 'La posición ya está ocupada en esta prueba';
    return res.status(400).json({ success: false, message: errorType });
  }
  
  return res.status(500).json({ 
    success: false, 
    message: error.message || 'Error interno del servidor' 
  });
};

// Crear resultado con validación de inscripción
exports.createResultado = async (req, res) => {
  try {
    const { competenciaId } = req.params;
    const { Prueba: pruebaId, Atleta: atletaId, Posicion, Marca, Puntos } = req.body;

    // Validaciones paralelas
    const [competencia, atleta, prueba, inscripcionExistente] = await Promise.all([
      Competencia.findById(competenciaId).select('Atletas Pruebas'),
      Atleta.findById(atletaId).select('Nombre Apellido'),
      Prueba.findById(pruebaId).select('Nombre Competencias'),
      Inscripcion.findOne({ 
        Competencia: competenciaId,
        Prueba: pruebaId,
        Atleta: atletaId
      })
    ]);

    // Validaciones secuenciales
    if (!competencia) {
      return res.status(404).json({ 
        success: false,
        message: 'Competencia no encontrada' 
      });
    }

    if (!atleta) {
      return res.status(404).json({ 
        success: false,
        message: 'Atleta no encontrado' 
      });
    }

    if (!prueba) {
      return res.status(404).json({ 
        success: false,
        message: 'Prueba no encontrada' 
      });
    }

    if (!prueba.Competencias || !prueba.Competencias.some(c => c && c.toString() === competenciaId.toString())) {
      return res.status(400).json({ 
        success: false,
        message: 'La prueba no pertenece a esta competencia' 
      });
    }

    if (!inscripcionExistente) {
      return res.status(400).json({ 
        success: false,
        message: 'El atleta no está inscrito en esta prueba' 
      });
    }

    // Validar posición única
    const posicionOcupada = await Resultado.findOne({
      Competencia: competenciaId,
      Prueba: pruebaId,
      Posicion: Posicion
    });

    if (posicionOcupada) {
      return res.status(400).json({ 
        success: false,
        message: `La posición ${Posicion} ya está ocupada en esta prueba` 
      });
    }

    // Crear el resultado
    const nuevoResultado = await Resultado.create({
      Competencia: competenciaId,
      Prueba: pruebaId,
      Atleta: atletaId,
      Posicion,
      Marca,
      Puntos: Puntos || 0
    });

    // Populate para la respuesta
    const resultadoPopulado = await Resultado.findById(nuevoResultado._id)
      .populate('Atleta', 'Nombre_Apellido')
      .populate('Prueba', 'Nombre');

    res.status(201).json({
      success: true,
      data: resultadoPopulado
    });

  } catch (error) {
    handleError(res, error);
  }
};

// Obtener resultados agrupados por prueba (optimizado)
exports.getResultadosByCompetencia = async (req, res) => {
  try {
    const { competenciaId } = req.params;

    const resultados = await Resultado.find({ Competencia: competenciaId })
      .populate({
        path: 'Atleta',
        select: 'Nombre_Apellido', //Activo por esta zona!
        model: 'Atletas' 
      })
      .populate({
        path: 'Prueba',
        select: 'Nombre Estilo',
        model: 'Pruebas' 
      })
      .sort({ Prueba: 1, Posicion: 1 })
      .lean();

    // Agrupamiento eficiente por prueba
    const resultadosPorPrueba = resultados.reduce((acc, curr) => {
      const clave = curr.Prueba._id.toString();
      if (!acc[clave]) {
        acc[clave] = {
          Prueba: curr.Prueba,
          resultados: []
        };
      }
      acc[clave].resultados.push({
        _id: curr._id,
        Atleta: curr.Atleta,
        Posicion: curr.Posicion,
        Marca: curr.Marca,
        Puntos: curr.Puntos,
        FechaRegistro: curr.FechaRegistro
      });
      return acc;
    }, {});

    res.status(200).json(resultadosPorPrueba);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getResultadosByPrueba = async (req, res) => {
  try {
    const { competenciaId, pruebaId } = req.params;

    const resultados = await Resultado.find({
      Competencia: competenciaId,
      Prueba: pruebaId
    })
    .populate({
      path: 'Atleta',
      select: 'Nombre_Apellido',
      model: 'Atletas'
    })
    .sort({ Posicion: 1 });

    res.status(200).json({
      success: true,
      data: resultados
    });

  } catch (error) {
    handleError(res, error);
  }
};

// Actualizar resultado
exports.updateResultado = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar si se está actualizando la posición
    if (updateData.Posicion !== undefined) {
      const resultadoActual = await Resultado.findById(id);
      if (!resultadoActual) {
        return res.status(404).json({
          success: false,
          message: 'Resultado no encontrado'
        });
      }

      // Verificar si la nueva posición ya está ocupada
      const posicionOcupada = await Resultado.findOne({
        Competencia: resultadoActual.Competencia,
        Prueba: resultadoActual.Prueba,
        Posicion: updateData.Posicion,
        _id: { $ne: id } // Excluir el actual
      });

      if (posicionOcupada) {
        return res.status(400).json({
          success: false,
          message: `La posición ${updateData.Posicion} ya está ocupada en esta prueba`
        });
      }
    }

    const resultadoActualizado = await Resultado.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate({
      path: 'Atleta',
      select: 'Nombre_Apellido',
      model: 'Atletas'
    })
    .populate({
      path: 'Prueba',
      select: 'Nombre',
      model: 'Pruebas'
    });

    if (!resultadoActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Resultado no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: resultadoActualizado
    });

  } catch (error) {
    handleError(res, error);
  }
};

// Eliminar resultado
exports.deleteResultado = async (req, res) => {
  try {
    const { id } = req.params;

    const resultadoEliminado = await Resultado.findByIdAndDelete(id);

    if (!resultadoEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Resultado no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resultado eliminado correctamente',
      data: { _id: id }
    });

  } catch (error) {
    handleError(res, error);
  }
};