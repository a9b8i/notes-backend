const mongoose = require('mongoose')

const url = 'mongodb+srv://fullstack:FullStackOpen@cluster0.akdhmiz.mongodb.net/testNoteApp?retryWrites=true&w=majority'

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

const note = new Note({
  content: 'Moongooooooooooose is cool',
  important: true
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})

