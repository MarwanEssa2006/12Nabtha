import React from 'react';

export function BackgroundStage() {
  return (
    <div className="stage" aria-hidden="true">
      <picture>
        <source media="(max-width: 700px)" srcSet="/assets/img/bg-workshop-portrait.webp" />
        <img src="/assets/img/bg-workshop-1600.webp" alt="" />
      </picture>
    </div>
  );
}
