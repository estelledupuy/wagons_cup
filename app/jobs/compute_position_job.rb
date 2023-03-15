class ComputePositionJob < ApplicationJob
  queue_as :default
  sidekiq_options retry: false

  def perform(id)
    @boat = Boat.find(id)
    new_pos = ComputeNewPosition.new(@boat, @boat.direction).call

    return if new_pos.nil?

    latitude, longitude, wind_dir = new_pos[0], new_pos[1], new_pos[2]


    @boat.trace << [longitude, latitude]
    @boat.update(latitude: latitude, longitude: longitude, direction: wind_dir)
    @boat.save!

    BoatChannel.broadcast_to(
      @boat, { trace: @boat.trace, longitude: @boat.longitude, latitude: @boat.latitude, wind_dir: wind_dir, boat_dir: @boat.direction }
    )
  end
end
