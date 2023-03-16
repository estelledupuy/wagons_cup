class AddPortsToRace < ActiveRecord::Migration[7.0]
  def change
    add_column :races, :departure_port, :string
    add_column :races, :arrival_port, :string
  end
end
