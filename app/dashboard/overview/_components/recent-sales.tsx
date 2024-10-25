import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>SR</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Suraj Rajbhar</p>
          <p className="text-sm text-muted-foreground">
            surajrajbhar5@gmail.com
          </p>
        </div>
        <div className="ml-auto font-medium">+₹1,999.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>SU</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Suhan Uchil</p>
          <p className="text-sm text-muted-foreground">
            sushan.uchil@email.com
          </p>
        </div>
        <div className="ml-auto font-medium">+₹39.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Suraj Mahato</p>
          <p className="text-sm text-muted-foreground">
            suraj.mahato@email.com
          </p>
        </div>
        <div className="ml-auto font-medium">+₹299.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>AR</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Aditya Rajauria 👑</p>
          <p className="text-sm text-muted-foreground">
            aditya.rajauria@gmail.com
          </p>
        </div>
        <div className="ml-auto font-medium">+₹99.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>RU</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Rajesh</p>
          <p className="text-sm text-muted-foreground">rajesh.5@email.com</p>
        </div>
        <div className="ml-auto font-medium">+₹39.00</div>
      </div>
    </div>
  );
}
