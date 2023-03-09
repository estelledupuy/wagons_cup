class Boat < ApplicationRecord
  belongs_to :game

  def self.image_urls(color)
    {
      "Poppy" => "https://res.cloudinary.com/dwclozjta/image/upload/v1678372133/bateau_poppy_kqqsnl.png",
      "Navy" => "https://res.cloudinary.com/dwclozjta/image/upload/v1678372133/bateau_navy_mh1k4a.png",
      "Lemon" => "https://res.cloudinary.com/dwclozjta/image/upload/v1678372133/bateau_lemon_op5dfw.png"
    }[color]
  end
end
