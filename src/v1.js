/* eslint-disable prefer-destructuring */
const stringTemplate = require('string-template');

/**
 * Generate a properly formatted V1 ORID.
 *
 * @param {object} data The metadata object for all ORID parts.
 * @param {object} data.provider The provider for this ORID.
 * @param {object} [data.custom1] Optional provider specific field 1.
 * @param {object} [data.custom2] Optional provider specific field 2.
 * @param {object} [data.custom3] Optional provider specific field 3.
 * @param {object} data.service The service that the resource belongs to.
 * @param {object} data.resourceId The resource identified by this ORID.
 * @param {object} [data.resourceRider] Optional resource type associated with resource.
 * @param {boolean} [data.useSlashSeparator] True to use a slash (/) to separate the resourceId and resourceRider; False or omitted to use colon (:).
 */
const generate = (data) => {
  const mainFormat = 'orid:1:{provider}:{custom1}:{custom2}:{custom3}:{service}:{suffix}';
  const suffixFormat = '{resourceId}{separator}{resourceRider}';

  let suffix;
  if (data.resourceRider) {
    const separator = data.useSlashSeparator ? '/' : ':';
    suffix = stringTemplate(suffixFormat, {
      resourceId: data.resourceId,
      separator,
      resourceRider: data.resourceRider,
    });
  } else {
    suffix = stringTemplate(suffixFormat, {
      resourceId: data.resourceId,
    });
  }

  return stringTemplate(mainFormat, {
    provider: data.provider,
    custom1: data.custom1,
    custom2: data.custom2,
    custom3: data.custom3,
    service: data.service,
    suffix,
  });
};

const isValid = (value) => {
  const quickCheck = typeof value === 'string' && value.startsWith('orid:1:');
  if (!quickCheck) return false;

  const parts = value.split(':');
  return parts.length === 8 || parts.length === 9;
};

/**
 * @typedef {object} ORID
 * @param {object} data The metadata object for all ORID parts.
 * @param {object} data.provider The provider for this ORID.
 * @param {object} [data.custom1] Optional provider specific field 1.
 * @param {object} [data.custom2] Optional provider specific field 2.
 * @param {object} [data.custom3] Optional provider specific field 3.
 * @param {object} data.service The service that the resource belongs to.
 * @param {object} data.resourceId The resource identified by this ORID.
 * @param {object} [data.resourceRider] Optional resource type associated with resource.
 * @param {boolean} [data.useSlashSeparator] True to use a slash (/) to separate resourceId and resourceRider; False or omitted to use colon (:).
 */

/**
 * Parses a properly formatted ORID into an object for easier consumption.
 * @param {string} orid The ORID to parse.
 * @returns {ORID}
 */
const parse = (orid) => {
  if (typeof orid !== 'string') throw TypeError('orid must be of type string');

  if (!orid.startsWith('orid:1:')) throw new Error('Provided string does not appear to be a orid');

  const oridParts = orid.split(':');
  if (oridParts.length !== 8 && oridParts.length !== 9) throw new Error('ORID appears to be invalid format');

  if (oridParts.length === 9) {
    return {
      provider: oridParts[2],
      custom1: oridParts[3],
      custom2: oridParts[4],
      custom3: oridParts[5],
      service: oridParts[6],
      resourceId: oridParts[7],
      resourceRider: oridParts[8],
    };
  }

  let resourceRider;
  let resourceId;

  if (oridParts[7].indexOf('/') > -1) {
    const resourceParts = oridParts[7].split('/');
    resourceId = resourceParts[0];
    resourceRider = resourceParts.slice(1).join('/');
  } else {
    resourceId = oridParts[7];
    resourceRider = undefined;
  }

  return {
    provider: oridParts[2],
    custom1: oridParts[3],
    custom2: oridParts[4],
    custom3: oridParts[5],
    service: oridParts[6],
    resourceId,
    resourceRider,
  };
};

module.exports = {
  generate,
  isValid,
  parse,
};
