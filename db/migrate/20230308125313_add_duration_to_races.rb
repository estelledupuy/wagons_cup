class AddDurationToRaces < ActiveRecord::Migration[7.0]
  def change
    add_column :races, :duration, :integer
  end
end
