class AddCoordinatesToRaces < ActiveRecord::Migration[7.0]
  def change
    add_column :races, :coordinates, :text, array: true, default: []
  end
end
