function computeStatus(field) {
  if (field.stage === 'HARVESTED') return 'Completed';

  const daysSincePlanted = Math.floor(
    (Date.now() - new Date(field.plantingDate)) / (1000 * 60 * 60 * 24)
  );

  const lastUpdate = field.updates?.[0]?.createdAt;
  const daysSinceUpdate = lastUpdate
    ? Math.floor((Date.now() - new Date(lastUpdate)) / (1000 * 60 * 60 * 24))
    : daysSincePlanted;

  if (daysSinceUpdate >= 7 || (field.stage === 'GROWING' && daysSincePlanted > 90)) {
    return 'At Risk';
  }

  return 'Active';
}

module.exports = { computeStatus };