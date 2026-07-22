const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose')

if(process.argv.length<3){
    console.log('Give password as an argument.')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.skiroor.mongodb.net/?appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, {family:4})

const phoneBookSchema = new mongoose.Schema({
    name:String,
    number:String,
})

const Person = mongoose.model('Person', phoneBookSchema)

if(process.argv.length === 3){
    
    Person.find({}).then(persons => {
        console.log("phonebook: ")
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
         mongoose.connection.close()
    })


}else if(process.argv.length === 5){
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    person.save().then(result => {
        console.log(`Added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
}else{
    console.log("provide correct number of arguments")
     process.exit(1)
}