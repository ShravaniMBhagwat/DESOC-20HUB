import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Users,
  Star,
  DollarSign,
  Award,
  Play,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { Workshop } from "@/data/workshops";
import { Link } from "react-router-dom";

interface EnhancedWorkshopCardProps {
  workshop: Workshop;
  isRegistered: boolean;
  onRegister: (workshopId: string) => void;
  onUnregister: (workshopId: string) => void;
}

export function EnhancedWorkshopCard({
  workshop,
  isRegistered,
  onRegister,
  onUnregister,
}: EnhancedWorkshopCardProps) {
  const availableSlots = workshop.capacity - workshop.registeredUsers.length;
  const isFull = availableSlots <= 0;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-success-100 text-success-700 border-success-200";
      case "Intermediate":
        return "bg-warning-100 text-warning-700 border-warning-200";
      case "Advanced":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : index < rating
              ? "text-yellow-400 fill-current opacity-50"
              : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="professional-card h-full flex flex-col">
      {/* Image and Badges */}
      <div className="relative">
        <img
          src={workshop.imageUrl}
          alt={workshop.name}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            e.currentTarget.src = `https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop`;
          }}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={`${getLevelColor(workshop.level)} font-medium`}>
            {workshop.level}
          </Badge>
          {workshop.featured && (
            <Badge className="bg-brand text-white">Featured</Badge>
          )}
        </div>
        <div className="absolute top-3 right-3">
          {isRegistered && (
            <Badge className="bg-success text-white">Registered</Badge>
          )}
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-white/90 text-gray-900 font-bold">
            ${workshop.price}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Link
              to={`/workshop/${workshop.id}`}
              className="hover:text-brand transition-colors"
            >
              <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-2">
                {workshop.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {renderStars(workshop.rating)}
              </div>
              <span className="text-sm font-medium">{workshop.rating}</span>
              <span className="text-sm text-gray-500">
                ({workshop.reviewCount} reviews)
              </span>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={workshop.instructorImage}
                  alt={workshop.instructor}
                />
                <AvatarFallback className="text-xs">
                  {workshop.instructor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">
                {workshop.instructor}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        <p className="text-gray-600 text-sm line-clamp-3 flex-1">
          {workshop.shortDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {workshop.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {workshop.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{workshop.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Workshop Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{workshop.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{workshop.duration}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Users className="w-4 h-4" />
              <span>
                {availableSlots} / {workshop.capacity} slots
              </span>
            </div>
            <Badge
              variant={isFull ? "destructive" : "secondary"}
              className={
                isFull
                  ? "bg-red-100 text-red-800 border-red-200"
                  : "bg-success-100 text-success-800 border-success-200"
              }
            >
              {isFull ? "Full" : "Available"}
            </Badge>
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {workshop.isLive && (
            <div className="flex items-center gap-1">
              <Play className="w-3 h-3" />
              <span>Live</span>
            </div>
          )}
          {workshop.isRecorded && (
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>Recorded</span>
            </div>
          )}
          {workshop.certificate && (
            <div className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>Certificate</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Link to={`/workshop/${workshop.id}`}>
            <Button
              variant="outline"
              className="w-full justify-between border-2 border-brand text-brand hover:bg-brand hover:text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              View Curriculum
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            onClick={() =>
              isRegistered ? onUnregister(workshop.id) : onRegister(workshop.id)
            }
            disabled={!isRegistered && isFull}
            className={`w-full ${
              isRegistered
                ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                : isFull
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-brand hover:bg-brand/90 text-white"
            }`}
            variant={isRegistered ? "outline" : "default"}
          >
            {isRegistered
              ? "Cancel Registration"
              : isFull
                ? "Workshop Full"
                : "Register Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
