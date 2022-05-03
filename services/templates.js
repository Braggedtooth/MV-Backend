const CLIENTURL = process.env.CLIENT_BASE_URL
const ts = Date.now() + 900000
const expiratation = new Date(ts)
let hours = expiratation.getHours()
let minutes = expiratation.getMinutes()

const Templates = {
  verifyHtml: (firstname, lastname, code) => `
<h3>Hej! ${firstname} ${lastname}</h3>
<br>
<p>Klicka på nedanstående länk för att verifera ditt konto</p>
<br>
<a href=${`${CLIENTURL}/verifiera?token=${code}`}> Verifiera Konto</a>
<p>Länken går ut klockan ${`0${hours}`.slice(-2)}:${`0${minutes}`.slice(-2)}</p>
`,
  resendHtml: (firstname, lastname, code) => `
<h3>Hej! ${firstname} ${lastname}</h3>
<br>
<p>Du försökte verifera ditt konto med ett utgånget länk, nedan finns en ny länk</p>
<br>
<a href=${`${CLIENTURL}/verifiera?token=${code}`}> Verifiera Konto</a>
<p>Länken går ut Klockan ${`0${hours}`.slice(-2)}:${`0${minutes}`.slice(-2)}</p>
`
}

module.exports = Templates