/* eslint-disable react/prop-types */
import React from 'react';

const AuthenticatedProfile = ({ children }) => {
  return (
    <section>
      <main>
          {children}
      </main>
    </section>
  );
};

export default AuthenticatedProfile;
