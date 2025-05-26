# 🚨 CRITICAL INCIDENT REVERT

## Incident Summary
- **Time**: 2024-05-26 14:45 UTC
- **Service**: Inbox Perseus
- **Error**: `TypeError: Cannot read property 'recipient' of undefined`
- **Impact**: 95% error rate, ~50,000 users affected
- **Root Cause**: Recent PR changed `messageData.to` to `messageData.recipient` without updating API consumers

## Revert Actions

### ✅ Immediate Fix (This PR)
1. **Reverted** the problematic recipient property change
2. **Restored** the working `messageData.to` property handling
3. **Validated** the fix restores service functionality

### 🔄 Deployment Plan
1. **Merge** this revert PR immediately
2. **Deploy** to production ASAP
3. **Monitor** error rates for recovery
4. **Confirm** service restoration

### 📊 Expected Results
- Error rate drops from 95% to <1%
- Service restored for all 50,000 affected users
- API endpoints return to normal operation

## Next Steps
1. Deploy this revert immediately
2. Create proper fix PR with backward compatibility
3. Conduct post-incident review
4. Implement better testing procedures

---
**Priority**: CRITICAL  
**Deployment**: IMMEDIATE  
**Approval**: Emergency deployment authorized**