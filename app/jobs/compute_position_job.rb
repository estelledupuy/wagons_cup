class ComputePositionJob < ApplicationJob
  queue_as :default
  sidekiq_options retry: false

  def perform(id)
    @boat = Boat.find(id)
    new_pos = ComputeNewPosition.new(@boat, @boat.direction).call

    return if new_pos.nil?

    latitude, longitude, wind_dir = new_pos[0], new_pos[1], new_pos[2]
    arrival_dist, departure_dist, boat_speed = new_pos[3], new_pos[4], new_pos[5]

    @boat.trace << [longitude, latitude]
    @boat.update(latitude: latitude, longitude: longitude)
    @boat.save!

    BoatChannel.broadcast_to(
      @boat, {
        trace: @boat.trace,
        longitude: @boat.longitude,
        latitude: @boat.latitude,
        wind_dir: wind_dir,
        boat_dir: @boat.direction,
        arrival_dist: arrival_dist,
        departure_dist: departure_dist,
        boat_speed: boat_speed
       }
    )
  end
end
