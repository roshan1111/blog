exports.errorResponse = async(res, status, message)=>{
    return res.status(status).send({
        sucess: false,
        message: message,
      })
} 
exports.sucessResponse = async(res, status, message, data)=>{
    return res.status(status).send({
        sucess: true,
        message: message,
        data: data
      })
}