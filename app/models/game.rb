class Game < ApplicationRecord
  belongs_to :race
  has_many :boats, dependent: :destroy

  def elapsed_time
    (Time.now - created_at) / 60
  end
end
