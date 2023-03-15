module RotationHelper

  def boat_direction_to_angle(boat_dir, wind_dir)
    case boat_dir
    when 1
      alphaBoat = wind_dir + 45 + 0
    when 2
      alphaBoat = wind_dir + 45 + 44
    when 3
      alphaBoat = wind_dir + 45 + 59
    when 4
      alphaBoat = wind_dir + 45 + 90
    when 5
      alphaBoat = wind_dir + 45 + 133
    when 6
      alphaBoat = wind_dir + 45 + 178
    when 7
      alphaBoat = wind_dir + 45 + 225
    when 8
      alphaBoat = wind_dir + 45 + 268
    when 9
      alphaBoat = wind_dir + 45 + 300
    when 10
      alphaBoat = wind_dir + 45 + 315
    end
    return "rotate(#{alphaBoat}deg)"
  end

end
