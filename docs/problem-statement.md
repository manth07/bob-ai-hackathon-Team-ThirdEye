# Problem Statement

## U1 — Power Outage Prediction & Grid Equipment Failure Advisor

### The Problem

Utility grid operators currently rely on **fixed-calendar maintenance schedules** rather than real-time equipment condition data. This creates a critical blind spot:

1. **Sensor data is ignored.** Modern transformers, substations, and feeders generate continuous telemetry — temperature, load levels, vibration, oil quality — but this data is rarely analysed predictively. Maintenance happens on a schedule, not when the equipment actually needs it.

2. **Weather is not combined with sensor data.** A transformer running at 85% load on a calm day is very different from the same transformer during a 90 km/h windstorm. Utilities don't combine these signals in real time.

3. **Historical incidents are not weighted.** An asset that had a major failure six months ago is statistically more likely to fail again, but this isn't factored into today's maintenance prioritisation.

4. **The cost of failure is enormous.** Unexpected transformer and substation failures cause blackouts that cost utilities **$1 million or more per hour** in outage costs, customer compensation, and emergency repair.

### Who Has This Problem

- **Grid operations managers** who schedule maintenance crews but have no early warning system.
- **Maintenance planners** who triage hundreds of assets across large geographic areas with no objective risk ranking.
- **Utility executives** who face regulatory scrutiny and financial liability when preventable outages occur.

### The Opportunity

If sensor health, live weather risk, and historical incident patterns could be combined into a single, interpretable score — and surfaced in a dashboard operators already know how to use — maintenance could shift from calendar-based to **condition-based and predictive**.

Early intervention on a high-risk transformer costs $5,000–$50,000. Emergency replacement after failure costs $500,000–$2,000,000+. The ROI on prediction is enormous.

### Why This Is Hard

- Sensor data, weather data, and incident history come from separate systems in different formats.
- Existing SCADA systems show raw values but don't synthesise a single actionable risk signal.
- Operators are already overloaded; any solution must be immediately interpretable, not a black box.
