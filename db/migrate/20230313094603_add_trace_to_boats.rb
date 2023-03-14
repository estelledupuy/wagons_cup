class AddTraceToBoats < ActiveRecord::Migration[7.0]
  def change
    add_column :boats, :trace, :float, array: true, default: []
  end
end
