import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface UserAvatarProps {
  url: string,
  fallbackData: string,
  className?: string
}
const UserAvatar = ({ url, fallbackData, className }: UserAvatarProps) => {
  return (
    <Avatar className={cn("h-7 w-7 md:w-10 md:h-10", className)}>
      <AvatarImage src={url} />
      <AvatarFallback>{fallbackData[0]}</AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
