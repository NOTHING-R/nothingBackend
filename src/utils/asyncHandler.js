const asyncHandeler = (requestHandlere) => {

  (req, res, next) => {

    Promise.resolve(requestHandlere(req, res, next)).catch((err) => next(err))

  }
}



export { asyncHandeler }


// const asyncHandeler = (func) => {() => {}}

// Another way of making a rapper function 
// const asyncHandeler = (fn) => async (req,res,next) => {
//   try {
//     await(fn(req,res,next))
//
//   } catch (error) {
//     req.status(err.code || 500).json({
//       success: false,
//       message: err.message
//     })
//   }
// }
//
