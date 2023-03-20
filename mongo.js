const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://huikke:${password}@cluster0.fsza8lt.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url)
  .then((result) => {
    console.log('connected')
    const name = process.argv[3]
    const number = process.argv[4]

    if (!name) { // if name is undefined, list database
      Person.find({}).then(result => {
        console.log('phonebook:')
          result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
          })
          mongoose.connection.close()
      })
    } else { // else add a new Person
      const person = new Person({
        name: name,
        number: number
      })

      person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()  
      })
    }
  })