class Game < ApplicationRecord
  belongs_to :race
  has_many :boats
end
