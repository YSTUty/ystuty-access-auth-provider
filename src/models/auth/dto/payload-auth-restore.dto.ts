import { Exclude } from 'class-transformer';
import { RequestAuthRestoreDto } from './request-auth-restore.dto';

@Exclude()
export class PayloadAuthRestoreDto extends RequestAuthRestoreDto {}
