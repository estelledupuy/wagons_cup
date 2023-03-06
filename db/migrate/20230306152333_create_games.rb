class CreateGames < ActiveRecord::Migration[7.0]
  def change
    create_table :games do |t|
      t.datetime :start_time
      t.datetime :end_time
      t.references :race, null: false, foreign_key: true

      t.timestamps
    end
  end
end
