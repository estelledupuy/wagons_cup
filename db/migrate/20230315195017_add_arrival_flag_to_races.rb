class AddArrivalFlagToRaces < ActiveRecord::Migration[7.0]
  def change
    add_column :races, :arrival_flag, :string
  end
end
