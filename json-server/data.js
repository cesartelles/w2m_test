// index.js
module.exports = () => {
  const data = { heroes: [] }

  data.heroes.push({ id: 1, name: "BRUCE WAYNE", alias: "Batman", shortBio: "Es un heroe disfrazado de murcielago", bio:"Long bio" })
  data.heroes.push({ id: 2, name: "CLARCK KENT", alias: "Superman", shortBio: "El super heroe mas poderoso", bio:"Long bio" })
  data.heroes.push({ id: 3, name: "PETER PARKER", alias: "Spiderman", shortBio: "El hombre araña", bio:"Long bio" })


  // Create 1000 users
  for (let i = 4; i <= 50; i++) {
    data.heroes.push({ id: i, name: `Name ${i}`, alias: `Alias ${i}`, shortBio: `Short bio ${i}`, bio:`Long bio ${i}`})
  }
  return data
}