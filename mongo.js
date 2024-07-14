const mongoose = require('mongoose')
const args = process.argv

if (args.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = args[2]

const url =
  `mongodb+srv://samip:${password}@cluster0.vmx2ufi.mongodb.net/phonebookApp?
  retryWrites=true&w=majority`


mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: String,
})

const Person = mongoose.model('Person', personSchema)

let persons = []


if (args.length===3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(p => {
          console.log(p.name, p.number)
        })
        mongoose.connection.close()
      })
}

else if (args.length===5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
    
} else {
    console.log('invalid amount of arguments')
    mongoose.connection.close()
}







