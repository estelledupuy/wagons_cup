class CreateBoats < ActiveRecord::Migration[7.0]
  def change
    create_table :boats do |t|
      t.string :name
      t.string :color
      t.float :latitude
      t.float :longitude
      t.integer :sail_position
      t.integer :direction
      t.integer :speed
      t.datetime :score
      t.references :game, null: false, foreign_key: true

      t.timestamps
    end
  end
end
