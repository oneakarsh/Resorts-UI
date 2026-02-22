import React, { Suspense } from 'react';
import DummyPaymentLoader from './DummyPaymentLoader';

export default function Page() {
  return (
    <Suspense fallback={<div /> }>
      <DummyPaymentLoader />
    </Suspense>
  );
}
