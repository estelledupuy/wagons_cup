class Race < ApplicationRecord
  has_many :games, dependent: :destroy
end
