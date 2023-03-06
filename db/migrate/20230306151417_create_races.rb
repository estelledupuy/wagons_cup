class CreateRaces < ActiveRecord::Migration[7.0]
  def change
    create_table :races do |t|
      t.string :name
      t.float :starting_latitude
      t.float :starting_longitude
      t.float :ending_latitude
      t.float :ending_longitude

      t.timestamps
    end
  end
end
