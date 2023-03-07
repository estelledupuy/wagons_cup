# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
puts "Cleaning database..."
Boat.destroy_all

puts 'Creating 1 fake boat...'

Boat.create(name: "Speed Geoffroy", color: "red", sail_position: 0, score: 0)

puts 'Creating 3 fake races...'

Race.create(name: "Brest - Valparaíso", starting_latitude: 48.3905283, starting_longitude: -4.4860088, ending_latitude: -33.0458456, ending_longitude: -71.6196749)
Race.create(name: "Saint-Malo - Le cap", starting_latitude: 48.649518, starting_longitude: -2.0260409, ending_latitude: -33.928992, ending_longitude: 18.417396)
Race.create(name: "Kochi - Sambava", starting_latitude: 9.9674277, starting_longitude: 76.2454436, ending_latitude: -14.254956, ending_longitude: 50.1556533)

puts 'Finished!'
