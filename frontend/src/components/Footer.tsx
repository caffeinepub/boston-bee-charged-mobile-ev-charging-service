import { Heart, Phone, Mail, MapPin } from 'lucide-react';
import { useGetBusinessInfo } from '../hooks/useQueries';

export function Footer() {
  const { data: businessInfo } = useGetBusinessInfo();

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/boston-bee-tech.dim_400x400.png"
                alt="Boston Bee Charged"
                className="h-12 w-12 rounded-lg"
              />
              <div>
                <h3 className="font-bold">Boston Bee Charged</h3>
                <p className="text-xs text-muted-foreground">Mobile EV Charging</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Bringing the charge to you. Professional mobile EV charging services in the Boston area.
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Contact Us</h3>
            {businessInfo && (
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${businessInfo.phone}`} className="hover:text-foreground">
                    {businessInfo.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${businessInfo.email}`} className="hover:text-foreground">
                    {businessInfo.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{businessInfo.address}</span>
                </div>
              </div>
            )}
          </div>

          {/* Hours */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Service Hours</h3>
            {businessInfo && (
              <p className="text-sm text-muted-foreground">{businessInfo.hours}</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 border-t border-border/40 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025. Built with{' '}
            <Heart className="inline h-4 w-4 fill-destructive text-destructive" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
