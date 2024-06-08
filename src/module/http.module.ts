import { HttpModule } from '@nestjs/axios';

export const httpModule = HttpModule.registerAsync({
  useFactory: () => ({
    timeout: 5000,
    maxRedirects: 5,
  }),
});
