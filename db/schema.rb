# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_03_09_161342) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "boats", force: :cascade do |t|
    t.string "name"
    t.string "color"
    t.float "latitude"
    t.float "longitude"
    t.integer "sail_position"
    t.integer "direction"
    t.integer "speed"
    t.datetime "score"
    t.bigint "game_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_boats_on_game_id"
  end

  create_table "games", force: :cascade do |t|
    t.datetime "start_time"
    t.datetime "end_time"
    t.bigint "race_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["race_id"], name: "index_games_on_race_id"
  end

  create_table "races", force: :cascade do |t|
    t.string "name"
    t.float "starting_latitude"
    t.float "starting_longitude"
    t.float "ending_latitude"
    t.float "ending_longitude"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "coordinates", default: [], array: true
    t.integer "duration"
    t.integer "difficulty"
    t.string "photo"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "nickname"
    t.boolean "admin", default: false, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "boats", "games"
  add_foreign_key "games", "races"
end
