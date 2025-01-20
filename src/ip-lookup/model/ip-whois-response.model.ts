import { IpWhoisInfo } from './ip-whois-info.model';
import { IpWhoisError } from './ip-whois-error.model';

export type IpWhoisResponse = IpWhoisInfo | IpWhoisError;
