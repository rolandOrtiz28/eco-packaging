import { Button } from "@/components/ui/button";

function CustomProductSeriesCard({ series, onRequestCustomization }) {
  return (
    <div className="group bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-lg">
      {/* Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={series.image}
          alt={series.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-lg mb-2 text-center">{series.name}</h3>
        <p className="text-gray-700 text-sm text-center mb-4 line-clamp-3">
          {series.description}
        </p>
      </div>

      {/* Button */}
      <div className="p-4 pt-0">
        <Button
          className="w-full bg-eco hover:bg-eco-dark"
          onClick={() => onRequestCustomization(series)}
        >
          Request Customization
        </Button>
      </div>
    </div>
  );
}

export default CustomProductSeriesCard;