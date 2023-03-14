require 'open-uri'

class ComputeNewPosition
  attr_accessor :boat, :direction

  def initialize(boat, direction)
    @boat = boat
    @direction = direction
  end

  def call
    get_wind_info
    return nil unless success?

    time_interval = (0.16).fdiv(60) # inputs in minutes, output in hours
    adj_coeff = 150 # A utiliser pour ajuster la distance parcourue aux besoins de la démo
    #info extracted from API, in degrees
    # boat_speed = allure-derived coeff * wind_speed
    # DIRECTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] avec 1: vent debout (0°), 2 & 10: Près (45°); 3 & 9: Bon près (60°);
    # 4 & 8: Travers (90°); 5 & 7: Grand largue (135°); 6: Vent arrière.
    # (degree) >> axe bateau / vent
    # https://fr.wikipedia.org/wiki/Allure_(marine)
    case @direction
    when 1
      allure_coeff = -10%
      gamma = @wind_direction - 180
    when 2
      allure_coeff = 90%
      gamma = @wind_direction + 45 -180
    when 10
      allure_coeff = 90%
      gamma = @wind_direction - 45 - 180
    when 3
      allure_coeff = 170%
      gamma = @wind_direction + 60 - 180
    when 9
      allure_coeff = 170%
      gamma = @wind_direction - 60 - 180
    when 4
      allure_coeff = 250%
      gamma = @wind_direction - 90 - 180
    when 8
      allure_coeff = 250%
      gamma = @wind_direction + 90 - 180
    when 5
      allure_coeff = 120%
      gamma = @wind_direction + 135 - 180
    when 7
      allure_coeff = 120%
      gamma = @wind_direction - 135 - 180
    else 6
      allure_coeff = 60%
      gamma = @wind_direction +180 - 180
    end

    boat_speed = allure_coeff * @wind_speedy
    boat_distance = boat_speed * time_interval * adj_coeff * 1.609 # 1.609 pour passer de mille à km

    gamma_radian = (gamma * Math::PI) / 180
    lat_change = - boat_distance * Math.cos(gamma_radian) / 110.574
    lon_change = - boat_distance * Math.sin(gamma_radian) / (111.32 * Math.cos((lat_change * Math::PI) / 180))

    new_lat = @boat.latitude + lat_change
    new_lon = @boat.longitude + lon_change

    return [new_lat, new_lon, @wind_direction]
  end

  private

  def get_wind_info
    url = "https://api.aerisapi.com/conditions/closest?p=#{@boat.latitude},#{@boat.longitude}&client_id=#{ENV["CLIENT_ID"]}&client_secret=#{ENV["CLIENT_SECRET"]}"
    payload = URI.open(url).read
    @data = JSON.parse(payload)

    if success?
      @wind_speedy = from_data("windSpeedMPH")
      @wind_direction = from_data("windDirDEG")
    end

    return nil
    # @weather = data['response'].first['ob']['weather']
    # @tempc = data['response'].first['ob']['tempC']
    # @icon = data['response'].first['ob']['icon']
  end

  def success?
    @data['success']
  end

  def from_data(key)
    @data['response'].first['periods'].first[key]
  end
end
