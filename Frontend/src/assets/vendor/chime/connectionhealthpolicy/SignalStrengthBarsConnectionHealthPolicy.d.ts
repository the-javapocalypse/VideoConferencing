import BaseConnectionHealthPolicy from './BaseConnectionHealthPolicy';
import ConnectionHealthData from './ConnectionHealthData';
import ConnectionHealthPolicy from './ConnectionHealthPolicy';
import ConnectionHealthPolicyConfiguration from './ConnectionHealthPolicyConfiguration';
export default class SignalStrengthBarsConnectionHealthPolicy extends BaseConnectionHealthPolicy implements ConnectionHealthPolicy {
    private static CONNECTION_UNHEALTHY_THRESHOLD;
    private static ZERO_BARS_NO_SIGNAL_TIME_MS;
    private static ONE_BAR_WEAK_SIGNAL_TIME_MS;
    private static TWO_BARS_TIME_MS;
    private static THREE_BARS_TIME_MS;
    private static FOUR_BARS_TIME_MS;
    private static FIVE_BARS_TIME_MS;
    private static MISSED_PONGS_LOWER_THRESHOLD;
    private static MISSED_PONGS_UPPER_THRESHOLD;
    constructor(configuration: ConnectionHealthPolicyConfiguration, data: ConnectionHealthData);
    maximumHealth(): number;
    health(): number;
}
