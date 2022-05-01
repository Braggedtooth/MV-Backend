const { StatusCodes } = require("http-status-codes")
const router = express.Router()
const db = require('../db')
router.get('/', async (req, res) => {
  const { id } = req.query
  const verify =  await db.otp.findfirst({
    where: {
      id: { id }
    },
    
  })
    if(!verify) return res.status(StatusCodes.BAD_REQUEST).json({error: 'Wrong code'})
  
    const user = await db.user.findFirst({
      where:{
        id:{ verify.userId}
      }})
      if(!user) return res.status(StatusCodes.BAD_REQUEST).json({error: 'Invalid user account'})
      await db.user.update({
        where:{
          id:{ user.userId}
        },
        data: {
          verified: true
        }
      })
      await db.otp.delete({
        where:{id:id}
      })
  res.status(200).json({message:'you have been verified'})
}
)
module.exports = router