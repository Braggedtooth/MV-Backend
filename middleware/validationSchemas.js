const { z } = require('zod')
const email = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim())

const firstname = z.string().transform((str) => str.toLowerCase().trim())
const lastname = z.string().transform((str) => str.toLowerCase().trim())

const password = z
  .string()
  .min(10)
  .max(100)
  .transform((str) => str.trim())

const Signup = z.object({
  email,
  password,
  firstname,
  lastname
})

const Login = z.object({
  email,
  password: z.string()
})

const ForgotPassword = z.object({
  email
})

const ResetPassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string()
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'] // set the path of the error
  })

const ChangePassword = z.object({
  currentPassword: z.string(),
  newPassword: password
})

module.exports = {
  Signup,
  Login,
  ForgotPassword,
  ResetPassword,
  ChangePassword

}
