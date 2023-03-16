class AddDepartureFlagToRaces < ActiveRecord::Migration[7.0]
  def change
    add_column :races, :departure_flag, :string
  end
end
