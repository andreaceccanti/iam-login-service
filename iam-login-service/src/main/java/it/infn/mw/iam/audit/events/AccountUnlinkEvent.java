package it.infn.mw.iam.audit.events;

import it.infn.mw.iam.authn.ExternalAuthenticationRegistrationInfo.ExternalAuthenticationType;
import it.infn.mw.iam.persistence.model.IamAccount;

public class AccountUnlinkEvent extends AccountEvent {

  private static final long serialVersionUID = -1605221918249294636L;

  private final ExternalAuthenticationType extAccountType;
  private final String issuer;
  private final String subject;

  public AccountUnlinkEvent(Object source, IamAccount account,
      ExternalAuthenticationType extAccountType, String issuer, String subject, String message) {
    super(source, account, message);
    this.extAccountType = extAccountType;
    this.issuer = issuer;
    this.subject = subject;
  }

  @Override
  protected void addAuditData() {
    super.addAuditData();
    getData().put("extAccountType", extAccountType);
    getData().put("extAccountIssuer", issuer);
    getData().put("extAccountSubject", subject);
  }
}
