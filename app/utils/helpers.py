from ..privacy.k_anonymity import apply_k_anonymity
from ..privacy.l_diversity import apply_l_diversity
from ..privacy.t_closeness import apply_t_closeness
from ..privacy.differential_privacy import apply_differential_privacy

def apply_rule(specificationData, privacyMethod, privacyQuasiIdentifier, privacyParameter, privacySensitive=None): 
    if privacyMethod == "k-anonymity":
        output = apply_k_anonymity(specificationData, privacyQuasiIdentifier, privacyParameter)

    elif privacyMethod == "l-diversity":
        if privacySensitive is None:
            raise ValueError("privacySensitive must be provided for l-diversity")
        output = apply_l_diversity(specificationData, privacyQuasiIdentifier, privacySensitive, privacyParameter)

    elif privacyMethod == "t-closeness":
        output = apply_t_closeness(specificationData, privacyQuasiIdentifier, privacyParameter)

    elif privacyMethod == "differential-privacy":
        output = apply_differential_privacy(specificationData, privacyQuasiIdentifier, privacyParameter)

    else:
        raise ValueError(f"Unsupported privacy method: {privacyMethod}")

    return output