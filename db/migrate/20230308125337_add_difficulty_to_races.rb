class AddDifficultyToRaces < ActiveRecord::Migration[7.0]
  def change
    add_column :races, :difficulty, :integer
  end
end
