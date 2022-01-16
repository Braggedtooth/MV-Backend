

const permissions = {
 READ: 'read',
 WRITE_REVIEWS: 'Wrewiews',
 WRITE_COMMENTS: 'Wcomments',
 DELETE_COMMENTS: 'Dcomments',
 DELETE_REVIEWS: 'Dreviews',
 UPDATE_REVIEWS: 'UReviews',
 PUBLISH_REVIEWS: 'PReviews'
}
app.get('/g', async (req, res) => {
 const { userId } = req.query
 const user = await prisma.user.findFirst({ where: { id: userId } })
 if (user.verified) {
   const data = await db.permissions.create({
     data: {
       permit: [permissions.WRITE_REVIEWS, permissions.WRITE_COMMENTS, permissions.UPDATE_REVIEWS, permissions.PUBLISH_REVIEWS],
       userId: user.id
     },
     select: { permit: true, User: true }

   })
   res.status(201).json(data)
 } else res.status(403).json({ error: 'that not right mate' })
})

app.get('/verify', async (req, res) => {
 const { userId } = req.query
 await prisma.user.update({
   where: {
     id: { userId }
   },
   data: {
     verified: true
   }
 })

 res.status(200).send('you have been verified')
}
)
app.get('/verify/name', async (req, res) => {
 const { firstname, lastname, userId } = req.body
 if (!firstname || !lastname | !userId) return res.json({ sucess: fale, message: 'please add all required fields' })
 await prisma.user.update({
   where: {
     id: { userId }
   },
   data: {
     firstname: firstname,
     lastname: lastname
   }
 })

 res.status(200).send('you have been verified')
}
)
