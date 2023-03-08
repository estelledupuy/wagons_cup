class AddPhotoToRaces < ActiveRecord::Migration[7.0]
  def change
    add_column :races, :photo, :string
  end
end
