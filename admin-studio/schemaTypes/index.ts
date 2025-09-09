// Documents
import apartment from './documents/apartment';
import city from './documents/city';
import amenity from './documents/amenity';
import availabilityRequest from './documents/availabilityRequest';
import user from './documents/user';
import account from './documents/account';
import verificationToken from './documents/verificationToken';
import experienceCategory from "./documents/experienceCategory";
import chatWithAgents from './documents/chatWithAgents';

// Components
import apartmentImage from './components/apartmentImage';
import apartmentAmenity from './components/apartmentAmenity';
import priceRange from './components/priceRange';
import location from './components/location';
// chatMessage removed for simplified schema

export const schemaTypes = [
  // Documents
  apartment,
  city,
  amenity,
  availabilityRequest,
  user,
  account,
  verificationToken,
  experienceCategory,
  chatWithAgents,

  // Components
  apartmentImage,
  apartmentAmenity,
  priceRange,
  location,
];
