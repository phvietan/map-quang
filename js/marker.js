class Marker {
  iconUrl;
  location; // Point
  description;

  constructor(location, description = '', iconUrl = '/icon/map-marker.png') {
    this.location = location;
    this.iconUrl = iconUrl;
    this.description = description; 
  }
}